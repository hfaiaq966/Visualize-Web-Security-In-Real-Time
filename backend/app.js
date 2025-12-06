import express from "express";
import cors from "cors";
import sslChecker from "ssl-checker";

const app = express();
app.use(cors());
app.use(express.json());

// FETCH REAL SSL CERTIFICATE
app.get("/api/certificate/:domain", async (req, res) => {
  const domain = req.params.domain;

  try {
    const result = await sslChecker(domain, { method: "GET", port: 443 });

    res.json({
      domain,
      valid: result.valid,
      validFrom: result.validFrom,
      validTo: result.validTo,
      daysRemaining: result.daysRemaining,
      issuer: result.issuer,
      protocols: result.protocols, // TLS versions
      grade: result.grade,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching certificate" });
  }
});

// START SERVER
app.listen(3001, () => {
  console.log("Backend server running on http://localhost:3001");
});
